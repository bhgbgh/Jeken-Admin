// export default (path) => (resolve) =>
// require([`${path}`], resolve)

// export default (path) => () =>
// import (`${path}`)

export default (component) => () =>
import (`@/${component}.vue`)