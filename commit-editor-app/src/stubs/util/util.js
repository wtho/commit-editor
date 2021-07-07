export const inspect = (objectToInspect) => {
  return JSON.stringify(objectToInspect, null, 2)
}

export default { inspect }
