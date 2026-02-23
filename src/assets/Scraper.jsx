import axios from 'axios'
import * as Cheerio  from 'cheerio'
import React from 'react'

const Scraper = () => {

    const scrapData = async () => {
        const { data } = await axios.get("https://www.dsfaisal.com/blog/sql/leetcode-sql-problem-solving")
        console.log(data)

        const $ = Cheerio.load(data);
        const content = $("article").html()
        console.log(content);
    }
    
    scrapData()

  return (
    <div>scraper</div>
  )
}

export default Scraper