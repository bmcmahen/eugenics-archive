eugenics-archive
================

A database and public website for the Living Archives on Eugenics.

Boring techno-tes: I'm using Express, Mongoose (to help with Mongodb), Jade, and Stylus. 

- [] Convert Models to a single model type, with a different field for type (type: ['event', 'person']). This would make queries easier, although less efficient. 
- [] Validation on the client-side for forms. 
- [x] Create generic sorting function that converts an object to an array, and sorts that array given a specified order. In other words, I will declare that I want the following order: title, shortDescription, fullDescription, Date (and then anything goes after that). 