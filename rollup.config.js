import minify from 'rollup-plugin-babel-minify';

export default {
    input: 'src/file-tree.js',
    plugins: [minify()],
    output: [
        {
            file: 'dist/file-tree.js',
            format: 'iife',
            name: 'CustomElement'
        },
        {
            file: 'dist/file-tree.es.js',
            format: 'es'
        },
        {
            file: 'dist/file-tree.umd.js',
            format: 'umd',
            name: 'CustomElement'
        }
    ]
}
