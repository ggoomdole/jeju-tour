import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { id: 1, name: '음식' },
      { id: 2, name: '관광' },
      { id: 3, name: '힐링' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    console.log('시드 데이터 삽입 완료');
    await prisma.$disconnect();
})
  .catch(async (e) => {
    console.error('시드 데이터 삽입 실패', e);
    await prisma.$disconnect();
    process.exit(1);
});
