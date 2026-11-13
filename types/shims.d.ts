/* types/shims.d.ts
 *
 * Ambient module declarations for untyped dependencies used by the app.
 */

declare module 'numeral' {
    interface NumeralInstance {
        format(pattern?: string): string
        value(): number
    }

    function numeral(value?: string | number | null): NumeralInstance

    export default numeral
}
