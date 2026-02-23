import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCE_URL = 'https://www.dsfaisal.com/blog/sql/leetcode-sql-problem-solving';
const OUTPUT_PATH = path.resolve('src/assets/questions.json');

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

const parseHeading = (rawHeading) => {
  const cleaned = normalizeText(rawHeading);
  const [left = '', difficulty = '', platform = ''] = cleaned.split('|').map((item) => item.trim());
  const idMatch = left.match(/^(\d+)\.\s*(.+)$/);

  return {
    id: idMatch ? Number(idMatch[1]) : null,
    title: idMatch ? idMatch[2] : left,
    difficulty: difficulty || 'Unknown',
    locked: /🔒/.test(platform),
  };
};

const parseSolutions = (contentContainer, sectionHeading) => {
  const solutions = [];
  let current = sectionHeading.next();

  while (current.length && current[0]?.tagName !== 'h2') {
    if (current[0]?.tagName === 'figure') {
      const code = current.find('pre code').text().replace(/\n{3,}/g, '\n\n').trim();
      if (code) {
        solutions.push({
          label: `Solution ${solutions.length + 1}`,
          sql: code,
        });
      }
    }

    current = current.next();
  }

  if (solutions.length > 0) {
    return solutions;
  }

  const fallbackFigure = contentContainer.find('figure').last();
  const fallbackCode = fallbackFigure.find('pre code').text().replace(/\n{3,}/g, '\n\n').trim();
  if (!fallbackCode) {
    return [];
  }

  return [{ label: 'Solution 1', sql: fallbackCode }];
};

const parseProblemSection = (article, headingEl) => {
  const heading = article(headingEl);
  const headingText = heading.text();
  const parsedHeading = parseHeading(headingText);
  const leetcodeUrl = heading.find('a[href*="leetcode.com"]').first().attr('href') ?? null;
  const sectionId = heading.attr('id') ?? '';

  const contentNodes = [];
  let current = heading.next();
  while (current.length && current[0]?.tagName !== 'h2') {
    contentNodes.push(current);
    current = current.next();
  }

  const container = article('<div></div>');
  for (const node of contentNodes) {
    container.append(node.clone());
  }

  const descriptionParts = [];
  const tables = [];
  container.find('p').each((_, p) => {
    const text = normalizeText(article(p).text());
    if (!text) {
      return;
    }

    if (/^table(s)?:/i.test(text)) {
      const tableNames = text
        .replace(/^table(s)?:/i, '')
        .split(',')
        .map((table) => normalizeText(table))
        .filter(Boolean);
      tables.push(...tableNames);
      return;
    }

    descriptionParts.push(text);
  });

  const description = descriptionParts.join(' ').trim();
  const solutions = parseSolutions(container, container.find('h3').first());

  return {
    section_id: sectionId,
    id: parsedHeading.id,
    title: parsedHeading.title,
    difficulty: parsedHeading.difficulty,
    locked: parsedHeading.locked,
    leetcode_url: leetcodeUrl,
    description,
    tables: [...new Set(tables)],
    solutions,
  };
};

const scrape = async () => {
  const { data: html } = await axios.get(SOURCE_URL, { timeout: 30000 });
  const $ = cheerio.load(html);

  const title = normalizeText($('h1 h2').first().text() || $('title').first().text());
  const published = normalizeText($('meta[property="article:published_time"]').attr('content') || '');
  const tags = $('a[href^="/tags/"]')
    .map((_, el) => normalizeText($(el).text()))
    .get()
    .filter(Boolean);

  const problems = [];
  const article = $('#nd-page .prose');
  article.children('h2').each((_, headingEl) => {
    const headingText = $(headingEl).text();
    if (!/leetcode/i.test(headingText)) {
      return;
    }
    const parsed = parseProblemSection($, headingEl);
    if (parsed.id && parsed.title && parsed.solutions.length > 0) {
      problems.push(parsed);
    }
  });

  const output = {
    source: SOURCE_URL,
    title,
    published,
    tags: [...new Set(tags)],
    total_problems: problems.length,
    scraped_at: new Date().toISOString(),
    problems,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Scraped ${problems.length} problems -> ${OUTPUT_PATH}`);
};

scrape().catch((error) => {
  console.error('Scraping failed:', error.message);
  process.exit(1);
});