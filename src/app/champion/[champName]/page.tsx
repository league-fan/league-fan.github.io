import Champ from '@/../.cache/champions.json'
import { Champion } from '@/types'
import { Role } from '@/types/champion'

interface Champion_if {
    [key: string]: Champion[]
}

function convertRoles(champions: any): Champion_if {
    const result: Champion_if = {}
    for (const key in champions) {
        result[key] = champions[key].map((champ: any) => ({
            ...champ,
            roles: champ.roles.map((role: string) => role as Role)
        }))
    }
    return result
}

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const champions: Champion_if = convertRoles(Champ);
    const champName = (await params).champName
    const champ = champions['default'].find((champ: Champion) => champ.name.toLowerCase() === champName.toLowerCase())
    return <textarea defaultValue={champ ? JSON.stringify(champ, null, 4) : 'Champion not found'} />
}