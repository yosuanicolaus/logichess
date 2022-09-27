mkdir dist/esm

cat >dist/esm/wrapper.js <<!EOF
import cjsModule from "../index.js";
export const Chess = cjsModule.Chess;
export default Chess;
!EOF

cat >dist/esm/package.json <<!EOF
{
    "type": "module"
}
!EOF