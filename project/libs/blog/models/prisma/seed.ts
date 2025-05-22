import { PrismaClient } from '@prisma/client';

const FIRST_TAG_UUID = '39614113-7ad5-45b6-8093-06455437e1e2';
const SECOND_TAG_UUID = 'efd775e2-df55-4e0e-a308-58249f5ea202';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getTags() {
  return [
    { id: FIRST_TAG_UUID, title: 'Books' },
    { id: SECOND_TAG_UUID, title: 'Magazines' },
  ];
}

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      title: 'Some title for first post',
      userId: FIRST_USER_ID,
      text: 'Some content for first post',
      description: 'Some description for first post',
      tags: {
        connect: [{ id: FIRST_TAG_UUID }],
      },
    },
    {
      id: SECOND_POST_UUID,
      title: 'Some title for second post',
      userId: FIRST_USER_ID,
      text: 'Some content for second post',
      description: 'Some description for second post',
      tags: {
        connect: [
          { id: FIRST_TAG_UUID },
          { id: SECOND_TAG_UUID },
        ]
      },
      comments: [
          {
            message: 'Some first comment for post',
            userId: FIRST_USER_ID,
          },
          {
            message: 'Some second comment for post',
            userId: SECOND_USER_ID,
          }
      ]
    }
  ]
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTags = getTags();
  for (const tag of mockTags) {
    await prismaClient.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id: tag.id,
        title: tag.title
      }
    });
  }

  const mockPosts = getPosts();
  for (const post of mockPosts) {
    const createdPost = await prismaClient.post.upsert({
      where: {
        id: post.id,
      },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        text: post.text,
        description: post.description,
        userId: post.userId,
      }
    });

    if (post.comments) {
      for (const comment of post.comments) {
        await prismaClient.comment.create({
          data: {
            message: comment.message,
            userId: comment.userId,
            postId: createdPost.id,
          }
        });
      }
    }
  }

  console.info('🤘️ Database was filled');
}


async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
