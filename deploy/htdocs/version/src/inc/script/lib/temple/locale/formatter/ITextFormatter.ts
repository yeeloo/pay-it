//console.log(new ReplaceFormatter({name: 'Narie', age: 29}).format('I am {name} and {age} years old'));

//console.log(new PluralFormatter({count_cats: 1, count_dogs: 2}).format('I HAVE {COUNT_DOGS} {DOG|COUNT_DOGS|DOGS} AND {COUNT_CATS} {CAT|COUNT_CATS|CATS}')); // I have 1 dog and 2 cats
//console.log(new PluralFormatter({count_cats: 1, count_dogs: 2}).format('I have {count_dogs} {dog|count_dogs} and {count_cats} {cat|count_cats}')); // I have 1 dog and 2 cats
//console.log(new PluralFormatter({count_cats: '1', count_dogs: '2'}).format('I have {count_dogs} {dog|count_dogs|dogs} and {count_cats} {cat|count_cats|cats}')); // I have 1 dog and 2 cats
//console.log(new PluralFormatter({count_cats: 'one', count_dogs: 'two'}).format('I have {count_dogs} {dog|count_dogs|dogs} and {count_cats} {cat|count_cats|cats}')); // I have 1 dog and 2 cats


interface IFormatter
{
	format(text:string):string;
}
export default IFormatter;