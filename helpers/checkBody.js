export const toEqualSentData = (expect, body, awaitingData) => {
  Object.entries(awaitingData).forEach(([k, v]) => {
    expect(body).toHaveProperty(k);
    expect(body[k]).toBe(v);
  })
}