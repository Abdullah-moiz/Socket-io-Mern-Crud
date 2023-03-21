export const testing = async (req, res , next) => {
    try {
        res.send('Hello World')
    } catch (error) {
        console.log(error)
    }
}