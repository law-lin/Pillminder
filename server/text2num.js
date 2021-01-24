function text2num(text) {
  let pillsDes = text.toUpperCase();
  let pills = 0;
  let frequency = 0;
  let indexPills;

  if (pillsDes.includes('ONE TABLET') || pillsDes.includes('1 TABLET')) {
    if (pillsDes.includes('ONE TABLET')) {
      pillsDes = pillsDes.replace(/ONE/g, '1');
    }
    indexPills = pillsDes.search('1');
  } else if (pillsDes.includes('TWO TABLET') || pillsDes.includes('2 TABLET')) {
    if (pillsDes.includes('TWO TABLET')) {
      pillsDes = pillsDes.replace(/TWO/g, '2');
    }
    indexPills = pillsDes.search('2');
  } else if (
    pillsDes.includes('THREE TABLET') ||
    pillsDes.includes('3 TABLET')
  ) {
    if (pillsDes.includes('THREE TABLET')) {
      pillsDes = pillsDes.replace(/THREE/g, '3');
    }
    indexPills = pillsDes.search('3');
  } else if (
    pillsDes.includes('FOUR TABLET') ||
    pillsDes.includes('4 TABLET')
  ) {
    if (pillsDes.includes('FOUR TABLET')) {
      pillsDes = pillsDes.replace(/FOUR/g, '4');
    }
    indexPills = pillsDes.search('4');
  } else if (
    pillsDes.includes('FIVE TABLET') ||
    pillsDes.includes('5 TABLET')
  ) {
    if (pillsDes.includes('FIVE TABLET')) {
      pillsDes = pillsDes.replace(/FIVE/g, '5');
    }
    indexPills = pillsDes.search('5');
  }

  pills = parseInt(pillsDes[indexPills]);

  if (pillsDes.includes('EVERY DAY' || 'DAILY')) {
    frequency = 24;
  }
  return {
    reminderMessage: `Take ${pills} pill(s) every ${frequency} hour(s).`,
    frequency,
    pills,
  };
}

module.exports = text2num;
// const Small = {
//   zero: 0,
//   one: 1,
//   two: 2,
//   three: 3,
//   four: 4,
//   five: 5,
//   six: 6,
//   seven: 7,
//   eight: 8,
//   nine: 9,
//   ten: 10,
//   eleven: 11,
//   twelve: 12,
//   thirteen: 13,
//   fourteen: 14,
//   fifteen: 15,
//   sixteen: 16,
//   seventeen: 17,
//   eighteen: 18,
//   nineteen: 19,
//   twenty: 20,
//   thirty: 30,
//   forty: 40,
//   fifty: 50,
//   sixty: 60,
//   seventy: 70,
//   eighty: 80,
//   ninety: 90,
// };

// const Magnitude = {
//   thousand: 1000,
//   million: 1000000,
//   billion: 1000000000,
//   trillion: 1000000000000,
//   quadrillion: 1000000000000000,
//   quintillion: 1000000000000000000,
//   sextillion: 1000000000000000000000,
//   septillion: 1000000000000000000000000,
//   octillion: 1000000000000000000000000000,
//   nonillion: 1000000000000000000000000000000,
//   decillion: 1000000000000000000000000000000000,
// };

// let a, n, g;

// function text2num(s) {
//   a = s.toString().split(/[\s-]+/);
//   n = 0;
//   g = 0;
//   a.forEach(feach);
//   return n + g;
// }

// function feach(w) {
//   let x = Small[w];
//   if (x != null) {
//     g = g + x;
//   } else if (w == 'hundred') {
//     g = g * 100;
//   } else {
//     x = Magnitude[w];
//     if (x != null) {
//       n = n + g * x;
//       g = 0;
//     } else {
//       alert('Unknown number: ' + w);
//     }
//   }
// }

// module.exports = text2num;
