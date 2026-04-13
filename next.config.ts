import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 通过 127.0.0.1（而非 localhost）打开 dev 时，Next 会拦截跨源 dev 资源，导致白屏或热更新失败。
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
   */
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
