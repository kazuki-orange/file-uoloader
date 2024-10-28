//.envから環境変数を取り出す
const runtimeConfig = useRuntimeConfig()
const apiURL = runtimeConfig.imageApiUrl

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    const paramsText = new URLSearchParams({
        id: body.id
    }).toString()

    const imageText = await fetch(`${apiURL}?${paramsText}`, {
        method: "get"
    })
        .then(async (res) => await res.text())
        .catch((e) => {
            console.warn(e)
        })

    return imageText
})