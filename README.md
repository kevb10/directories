
# Directory tree

A common method of organizing files on a computer is to store them in hierarchical directories. For instance:

  

```

photos/

  birthdays/

    joe/

    mary/

  vacations/

  weddings/

```

  

## Get started

I've implemented something similar. Please execute the following command to run the program:

`$ node directories commands.txt`

-  `directories` node file

-  `commands.txt` text file containing a list of instructions (the file name does not matter to the program as long as it's readable).

  Node v14.16.1

## Availble commands

### `CREATE`

Create a hierarchy of directories. It takes 1 parameter.

- path: the directory path to be created (e.g. photos, photos/birthdays/joe)  

It returns the newly created directory.

### `LIST`

List all directories. It takes no paramaters.

### `MOVE`

Move a directory from one place to another. It takes 2 parameters. 

- origin: the original path (e.g. old/path/name)
- destination: the destination path (e.g. new/path/name)

### `DELETE`

Delete a directory (and its children). It takes 1 parameter.

- path: the directory path to be deleted (e.g. photos/birthdays/joe -> deletes joe)  

It returns an array of the deleted directory key and value.


## Help
If you run into any problems, please email kevin [at] kevinmanase [dot] com.

