import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Animation,
  AnimationDriver,
  AnimationEngine,
  AnimationRenderer,
  AnimationRendererFactory,
  AnimationStyleNormalizer,
  BaseAnimationRenderer,
  NoopAnimationDriver,
  NoopAnimationStyleNormalizer,
  WebAnimationsDriver,
  WebAnimationsPlayer,
  WebAnimationsStyleNormalizer,
  allowPreviousPlayerStylesMerge,
  camelCaseToDashCase,
  containsElement,
  createEngine,
  getParentElement,
  invokeQuery,
  normalizeKeyframes,
  validateStyleProperty,
  validateWebAnimatableStyleProperty
} from "./chunk-2IEA3IBR.js";
import "./chunk-7LPAJPNJ.js";
import "./chunk-JWDWO77W.js";
import "./chunk-HN5XAPZX.js";
import "./chunk-PYGT3PED.js";
import "./chunk-O7OQSUEK.js";
import "./chunk-EIAEXUY4.js";
import "./chunk-YHCV7DAQ.js";
export {
  AnimationDriver,
  NoopAnimationDriver,
  Animation as ɵAnimation,
  AnimationEngine as ɵAnimationEngine,
  AnimationRenderer as ɵAnimationRenderer,
  AnimationRendererFactory as ɵAnimationRendererFactory,
  AnimationStyleNormalizer as ɵAnimationStyleNormalizer,
  BaseAnimationRenderer as ɵBaseAnimationRenderer,
  NoopAnimationStyleNormalizer as ɵNoopAnimationStyleNormalizer,
  WebAnimationsDriver as ɵWebAnimationsDriver,
  WebAnimationsPlayer as ɵWebAnimationsPlayer,
  WebAnimationsStyleNormalizer as ɵWebAnimationsStyleNormalizer,
  allowPreviousPlayerStylesMerge as ɵallowPreviousPlayerStylesMerge,
  camelCaseToDashCase as ɵcamelCaseToDashCase,
  containsElement as ɵcontainsElement,
  createEngine as ɵcreateEngine,
  getParentElement as ɵgetParentElement,
  invokeQuery as ɵinvokeQuery,
  normalizeKeyframes as ɵnormalizeKeyframes,
  validateStyleProperty as ɵvalidateStyleProperty,
  validateWebAnimatableStyleProperty as ɵvalidateWebAnimatableStyleProperty
};
