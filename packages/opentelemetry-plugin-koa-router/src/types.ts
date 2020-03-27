export type KoaRouterPluginConfig = {
  name: string;
};

export type PathParams = string | RegExp | Array<string | RegExp>;

/**
 * This symbol is used to mark koa-router layer as being already instrumented
 */
export const kLayerPatched: unique symbol = Symbol(
  'koa-router-handler-patched'
);

// https://github.com/koajs/router/blob/master/lib/router.js#L65
export type KoaRouter = {
  params: { [key: string]: string };
  opts: KoaOptions; // @TODO
  methods: string[];
  stack: KoaLayer[];
};

export type KoaBaseOptions = {
  name: string;
  strict: boolean;
  prefix: string;
};

export type KoaOptions = {
  methods: String[];
} & KoaBaseOptions;

// https://github.com/koajs/router/blob/master/lib/layer.js#L21
export type KoaLayer = {
  [kLayerPatched]: boolean?;
  ignoreCaptures: boolean;
  name: string;
  end: boolean;
  prefix: string;
  paramNames: string[];
  path: string;
  regexp: RegExp;
  stack: Function | Function[];
};
