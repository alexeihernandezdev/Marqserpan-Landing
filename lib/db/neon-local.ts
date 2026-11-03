import { neonConfig } from "@neondatabase/serverless";

const LOCAL_HOST = "db.localtest.me";

/**
 * Si DATABASE_URL apunta a db.localtest.me (docker-compose.yml), el driver habla con el proxy
 * HTTP local en el puerto 4444 en lugar de con Neon. En Vercel no hace nada.
 */
export function configureLocalNeon(url: string) {
  if (!url.includes(`@${LOCAL_HOST}`)) return;
  neonConfig.fetchEndpoint = (host) =>
    host === LOCAL_HOST ? `http://${host}:4444/sql` : `https://${host}/sql`;
}
