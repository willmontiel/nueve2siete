/** Site URL of a file uploaded in the admin (served by app/media/[filename]/route.ts). */
export const mediaUrl = (filename: string) => `/media/${encodeURIComponent(filename)}`
