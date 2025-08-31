import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_ENDPOINT,
})

export interface S3Image {
  key: string
  url: string
  lastModified?: Date
  size?: number
}

export async function getImagesFromFolder(
  folderName: string,
): Promise<S3Image[]> {
  const bucketName = process.env.S3_BUCKET_NAME!

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: `${folderName}/`,
    Delimiter: "/",
  })

  try {
    const response = await s3Client.send(command)
    const images: S3Image[] = []
    console.log("S3 Response:", response)
    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key && isImageFile(object.Key)) {
          images.push({
            key: object.Key,
            url: `${process.env.S3_ENDPOINT}/${bucketName}/${object.Key}`,
            lastModified: object.LastModified,
            size: object.Size,
          })
        }
      }
    }

    return images.sort((a, b) => {
      if (!a.lastModified || !b.lastModified) return 0
      return b.lastModified.getTime() - a.lastModified.getTime()
    })
  } catch (error) {
    console.error("Error fetching images from S3:", error)
    return []
  }
}

function isImageFile(key: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ]
  const extension = key.toLowerCase().substring(key.lastIndexOf("."))
  return imageExtensions.includes(extension)
}
