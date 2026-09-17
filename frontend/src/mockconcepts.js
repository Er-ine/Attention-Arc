const mockConcepts = [
  {
    id: "basic",
    label: "What is a fraction?",
    explanation: {
      young:
        "Think of a pizza cut into 4 equal slices 🍕. If you eat 1 slice, you've eaten 1 out of 4 — we write that as 1/4.",
      teen: "A fraction represents a part of a whole, written as numerator/denominator — the denominator shows how many equal parts the whole is split into, and the numerator shows how many of those parts we're talking about.",
    },
    simplerExplanation: {
      young:
        "A fraction is just a way to write 'part of something.' Like half a cookie — that's 1 out of 2 pieces, or 1/2.",
      teen: "Simpler version: numerator = how many pieces you have. Denominator = how many pieces make the whole thing.",
    },
  },
  {
    id: "equivalent",
    label: "Equivalent fractions",
    explanation: {
      young:
        "1/2 and 2/4 look different but mean the same amount — like cutting a cookie into 2 big pieces or 4 small ones, eating half either way.",
      teen: "Equivalent fractions represent the same value even though the numerator and denominator differ — you get them by multiplying or dividing both by the same number.",
    },
    simplerExplanation: {
      young:
        "If you multiply the top AND bottom number by the same number, the fraction still means the same amount.",
      teen: "Same value, different numbers — like 50% written as 1/2 or 2/4 or 50/100.",
    },
  },
  {
    id: "denominator",
    label: "Common denominators",
    explanation: {
      young:
        "To compare or add fractions, they need to be cut into the same size pieces first — that's the common denominator.",
      teen: "A common denominator is a shared multiple of two denominators, letting you compare or combine fractions directly.",
    },
    simplerExplanation: {
      young:
        "It's like making sure two pizzas are both cut into the same number of slices before comparing them.",
      teen: "Find a number both denominators divide into evenly — that becomes the new shared denominator.",
    },
  },
  {
    id: "addition",
    label: "Adding fractions",
    explanation: {
      young:
        "Once the pieces are the same size, just add how many pieces you have! 1/4 + 2/4 = 3/4.",
      teen: "Once denominators match, add the numerators and keep the denominator the same: a/c + b/c = (a+b)/c.",
    },
    simplerExplanation: {
      young:
        "Same-size pieces? Just add the top numbers. Don't touch the bottom number.",
      teen: "Rule: never add denominators directly — only numerators, once denominators match.",
    },
  },
];

export default mockConcepts;
