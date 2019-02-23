declare module 'stats-lite' {
	export function numbers(arr: string[] | number[]): number[];
	export function sum(arr: string[] | number[]): number[];
    export function stdev(arr: number[]): number;
    export function mean(arr: number[]): number;
}
