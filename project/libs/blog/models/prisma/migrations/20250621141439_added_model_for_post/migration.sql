-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('video', 'text', 'photo', 'link', 'quote');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('published', 'draft');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_reposted" BOOLEAN NOT NULL DEFAULT false,
    "reposted_post_id" TEXT,
    "reposted_user_id" TEXT,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "status" "PostStatus" NOT NULL DEFAULT 'published',
    "type" "PostType" NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "video_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "announcement" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "text_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_posts" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "quote_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_posts" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "photo_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_posts" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "link_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_posts_post_id_key" ON "video_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "text_posts_post_id_key" ON "text_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "quote_posts_post_id_key" ON "quote_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "photo_posts_post_id_key" ON "photo_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "link_posts_post_id_key" ON "link_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_key" ON "tags"("title");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AddForeignKey
ALTER TABLE "video_posts" ADD CONSTRAINT "video_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text_posts" ADD CONSTRAINT "text_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_posts" ADD CONSTRAINT "photo_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_posts" ADD CONSTRAINT "link_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
