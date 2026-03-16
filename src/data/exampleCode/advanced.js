export const advancedCode = {
  testing: {
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
  @view({})
  add({ a, b }) {
    return a + b;
  }
}`,
  },
};

export default advancedCode;
