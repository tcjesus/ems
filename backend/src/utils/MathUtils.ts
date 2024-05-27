const _gcd = (a: number, b: number) => {
  while (b) [a, b] = [b, a % b]
  return a
}

export class MathUtils {
  static gcd(nums: number[]): number {
    let n = nums[0]
    for (const num of nums) {
      if (num == nums[0]) continue
      n = _gcd(n, num)
    }
    return n
  }
}