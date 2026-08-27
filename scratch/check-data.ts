import prisma from '../src/lib/prisma';

async function main() {
    const b11 = await prisma.propertyUnit.findFirst({
        where: { unitNumber: { equals: 'b1-11', mode: 'insensitive' } }
    });
    console.log("b1-11 exists?", !!b11);
    if (b11) console.log(b11);
}
main().finally(() => prisma.$disconnect());
