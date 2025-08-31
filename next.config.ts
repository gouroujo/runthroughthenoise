import type { NextConfig } from "next"

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.ca-east-006.backblazeb2.com",
        port: "",
        pathname: "/photos-jujujojo/**",
        search: "",
      },
    ],
  },
}

export default config
