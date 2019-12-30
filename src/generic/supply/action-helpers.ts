import { Observable, Subject } from 'rxjs';

let actionCounter: number = 0;

/* Create Action
 ** A -- Function Arguments (payload it)
 ** P -- Stream Output (payload out)
 ** C -- Function Return (what to return after "ca" call)
 */
export function ca(): TActionSignal;
export function ca<A>(): TAction<A>;
export function ca<A>(modifier: TModifier<A, A, void>): TAction<A>;
export function ca<A, C>(modifier: TModifier<A, A, C>): TAction<A, A, C>;
export function ca<A, P, C>(modifier: TModifier<A, P, C>): TAction<A, P, C>;
export function ca<A, P, C>(modifier?: TModifier<A, P, C>): TAction<A, P, C> {
  const $ = new Subject<P>();
  const next = (payload?: P) => $.next(payload);
  const action = (payload: unknown) => {
    if (typeof modifier === 'function') {
      return modifier(next, payload as A);
    } else {
      return next(payload as P | undefined);
    }
  };
  action.id = `A#${++actionCounter}`;
  action._ = (payload: unknown) => () => action(payload);
  action.$ = $;
  return action as TAction<A, P, C>;
}

// Generalize Actions
export const ga = <Actions>(namespace: string, actions: { [K in keyof Actions]: Actions[K] }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries<any>(actions).forEach(([key, action]) => {
    action.$.subscribe((payload: unknown) => {
      generalActionLog({
        action,
        key,
        namespace,
        payload,
      });
    });
  });
  return actions;
};

const generalActionLog = ca<IActionDust>();

export const generalActionsLog$ = generalActionLog.$;

type TModifier<A, P, C> = (R: (payload: P) => void, a: A) => C;

export type TAction<A, P = A, C = void> = {
  id: string;
  $: Observable<P>;
  _: (args: A) => () => C;
  (args: A): C;
};

export type TActionSignal = {
  id: string;
  $: Observable<unknown>;
  _: (...args: unknown[]) => () => void;
  (...args: unknown[]): void;
};

export interface IActionDust {
  action: TActionSignal;
  key: string;
  namespace: string;
  payload: unknown;
}

/* const d = ca()
d()
d.$

const dd = ca<string>()
dd('h')
dd._('h')() // currying
dd.$

const dd2 = ca<string, number, (x: number) => void>((R, smth) => (x) => R(x + Number(smth)))
dd2.$
const h2 = dd2('df')
h2(3)

const tt = ga('tool', {
	d,
	dd,
	dd2,
}) */
