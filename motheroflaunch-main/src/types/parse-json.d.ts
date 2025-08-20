// types/parse-json.d.ts
declare module 'parse-json' {
    const parseJson: (input: string, reviver?: (key: string, value: any) => any) => any;
    export = parseJson;
  }
  