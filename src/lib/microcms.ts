import type { Blog } from '@/types/blog.types'
import type { MicroCMSQueries } from 'microcms-js-sdk'
import { createClient } from 'microcms-js-sdk'

const ENDPOINTS = {
  blog: 'blog',
} as const

export type BlogResponse = {
  totalCount: number
  offset: number
  limit: number
  contents: Blog[]
}

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
})

export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.get<BlogResponse>({ endpoint: ENDPOINTS.blog, queries })
}

export const getLatestBlog = async () => {
  const response = await getBlogs({ limit: 1, orders: '-publishedAt' })
  return response.contents[0]
}

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return await client.getListDetail<Blog>({
    endpoint: ENDPOINTS.blog,
    contentId,
    queries,
  })
}
