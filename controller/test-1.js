var getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();;
  };


console.log(new Date('2023-04-15').getMonth()+1,new Date('2023-04-15').getDate(),getDaysInMonth(4,2023)-1)