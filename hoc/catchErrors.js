exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// catchErrors()

/*
route file: 
app.use('/', routes)
app.use(errorHandlers.notFound)
flashValidationErrors
app.use(errorHandlers.developmentErrors)
production errors


all the route functions in a controller folder
catchErrors(addIssue) bla bla is in controller folder
*/
