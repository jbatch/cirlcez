import { getDebugParams } from './debug';
export function setPreviousName(name: string) {
  localStorage.setItem('lastName', name);
}

export function getPreviousName() {
  const debugParams = getDebugParams();
  if (debugParams.debug) {
    return debugParams.name;
  }
  return localStorage.getItem('lastName') || '';
}

export function setVendetta(id: string) {
  localStorage.setItem('vendetta', id);
}

export function getVendetta() {
  return localStorage.getItem('vendetta') || '';
}
