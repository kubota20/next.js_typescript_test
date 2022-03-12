import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

type mdData = {
  date: string
  title: string
}

// /pages/postsの中身.mdを持ってきます
const postsDirectory = path.join(process.cwd(), '/posts')

export const getSortedPostsData = () => {
  const fireNames = fs.readdirSync(postsDirectory)
  const allPostsData = fireNames.map((fireName) => {
    const id = fireName.replace(/\.md$/, '')

    const fullPath = path.join(postsDirectory, fireName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    return {
      id,
      // .mdでtitleも入ってるのでこちらもstring
      ...(matterResult.data as mdData),
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export const getPostData = async (id: string) => {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  // .mdの中身のテキストを表示させる為に必要
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()
  return {
    id,
    contentHtml,
    ...(matterResult.data as mdData),
  }
}
