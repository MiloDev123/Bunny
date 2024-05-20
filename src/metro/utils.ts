import { byDisplayName, byFilePath, byName, byProps, byStoreName, byTypeName } from "./filters";
import { findAllExports, findExports } from "./finders";

type ModuleExports = any;
type FilterCheckDef<A extends unknown[]> = (args: A, m: any, id: number) => boolean;

export interface FilterFn<A extends unknown[]> {
    (m: any, id: number): boolean;
    filter: FilterCheckDef<A>;
    args: A;
    isDefault: boolean;
    uniq: string;
}

export interface FilterDefinition<A extends unknown[]> {
    (...args: A): FilterFn<A>;
    byDefault(...args: A): FilterFn<A>;
    uniqMaker(args: A): string;
}

export function createFilterDefinition<A extends unknown[]>(
    fn: FilterCheckDef<A>,
    uniqMaker: (args: A) => string
): FilterDefinition<A> {
    function createHolder<T extends Function>(func: T, args: A, isDefault: boolean) {
        return Object.assign(func, {
            filter: fn,
            args,
            isDefault,
            uniq: [
                isDefault && "default::",
                uniqMaker(args)
            ].filter(Boolean).join("")
        });
    }

    const curried = (...args: A) => createHolder((m: ModuleExports, id: number) => fn(args, m, id), args, false);
    const curriedDefault = (...args: A) => {
        function filter(m: ModuleExports, id: number) {
            return m.__esModule && m.default ? fn(args, m.default, id) : false;
        }
        return createHolder(filter, args, true);
    };

    return Object.assign(curried, {
        byDefault: curriedDefault,
        uniqMaker
    });
}

export function createSimpleFilter(
    filter: (m: ModuleExports) => boolean,
    uniq: string
) {
    return createFilterDefinition(
        (_, m) => filter(m),
        () => `dynamic::${uniq}`
    )();
}

export const findByProps = (...props: string[]) => findExports(byProps(...props));
export const findByPropsAll = (...props: string[]) => findAllExports(byProps(...props));

export const findByName = (name: string, expDefault = true) => findExports(expDefault ? byName(name) : byName.byDefault(name));
export const findByNameAll = (name: string, expDefault = true) => findAllExports(expDefault ? byName(name) : byName.byDefault(name));

export const findByDisplayName = (name: string, expDefault = true) => findExports(expDefault ? byDisplayName(name) : byDisplayName.byDefault(name));
export const findByDisplayNameAll = (name: string, expDefault = true) => findAllExports(expDefault ? byDisplayName(name) : byDisplayName.byDefault(name));

export const findByTypeName = (name: string, expDefault = true) => findExports(expDefault ? byTypeName(name) : byTypeName.byDefault(name));
export const findByTypeNameAll = (name: string, expDefault = true) => findAllExports(expDefault ? byTypeName(name) : byTypeName.byDefault(name));

export const findByStoreName = (name: string) => findExports(byStoreName(name));
export const findByFilePath = (path: string) => findExports(byFilePath(path));
