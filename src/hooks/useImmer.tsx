/** useImmer
 * 1.方便做diff 避免无意义渲染
 * 2.只拷贝变动节点，其余部分保持引用不变（结构共享）
 * 3.不会意外“改坏”原数据
 * 4.创建新结构，V8底层快对象 性能更好
 * 5.练习hooks+ts开发
 */

// 使用useImmer
// const [info, setInfo] = useImmer({data: '123', age: 12});
// setInfo(draft => {
//     draft.data = '456'
// })

import { Draft, produce, freeze } from 'immer';
import { useCallback, useState } from 'react';
type DraftFunction<S> = (draft: Draft<S>) => void;
type Update<S> = (arg: S | DraftFunction<S>) => void;
type ImmerHook<S> = [S, Update<S>];
type NotFn<T> = T extends Function ? never : T;
// ts 函数签名
export function useImmer<S>(init: NotFn<S> | (() => NotFn<S>)): ImmerHook<NotFn<S>>;
export function useImmer<T>(initValue: T) {
  const [val, updateValue] = useState(
    freeze(typeof initValue === 'function' ? initValue() : initValue, true),
  );
  return [
    val,
    useCallback((updater: T | DraftFunction<T>) => {
      if (typeof updater === 'function') {
        //draft 中间可修改草稿
        //   updateValue(produce(val, updater as DraftFunction<T>));
        updateValue(produce(updater as DraftFunction<T>));
      } else {
        //强制更新 loadsh
        updateValue(freeze(updater));
      }
    }, []),
  ];
}