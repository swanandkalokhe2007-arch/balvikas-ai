import { resetDemoData, DEMO_PASSWORD } from './seed.js'

const data = await resetDemoData()
const parentKids = data.children.filter((c) => c.parentId === 'u_parent_1')
console.log('Prototype demo loaded')
console.log('Parent children:', parentKids.map((c) => c.name).join(', '))
console.log('Total children:', data.children.length)
console.log('Password:', DEMO_PASSWORD)
console.log('parent@demo.com | doctor@demo.com | worker@demo.com | admin@demo.com')
