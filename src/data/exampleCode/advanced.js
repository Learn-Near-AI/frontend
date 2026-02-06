// Advanced patterns and testing examples
// Note: initialization merged into upgrade-pattern (security.js)
// Note: gas-optimization merged into batch-operations (collections.js)
export const advancedCode = {
  'testing': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn add(&self, a: u64, b: u64) -> u64 {
        a + b
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let contract = Contract::new();
        assert_eq!(contract.add(2, 3), 5);
    }

    #[test]
    fn test_add_zero() {
        let contract = Contract::new();
        assert_eq!(contract.add(0, 0), 0);
    }
}`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor() {}

  @view({})
  add({ a, b }) {
    return a + b;
  }
}

// Unit test (run with: npm test or vitest)
// For pure logic without near.* calls, test the class directly:
//
// import { describe, it, expect } from 'vitest';
// import { Contract } from './contract';
//
// describe('Contract', () => {
//   it('add returns sum', () => {
//     const contract = new Contract();
//     expect(contract.add({ a: 2, b: 3 })).toBe(5);
//   });
//   it('add zero', () => {
//     const contract = new Contract();
//     expect(contract.add({ a: 0, b: 0 })).toBe(0);
//   });
// });
`,
  },
}

