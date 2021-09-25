const Todo = require("../Models/Todo");
// const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
// const ErrorHandler = require("../utils/errorHandler");
///// Add todo /////////

// exports.addtodo = catchAsyncErrors(async (req, res) => {
//   const todo = await Todo.create(req.body);

//   res.status(200).json({
//     success: true,
//     todo,
//   });
// });

exports.addtodo = async (req, res) => {
  const { username, title, category } = req.body;
  /// category = shudld be this value "task", "hobby", "work"],
  //console.log(title, category);

  const todo = new Todo({
    username,
    title,
    category,
  });

  todo.save((error, todo) => {
    if (error) {
      return res.status(400).json({
        message: "bad reqest data not added",
      });
    }

    if (todo) {
      return res.status(201).json({
        message: "Successfully addded a Todo",
        todo,
      });
    }
  });
};

/////////////// Get All Todo and also filetr by query //////////////

exports.getalltodo = async (req, res) => {
  ///////////////// Get all Todo //////////////////////////////
  // const todo = await Todo.find();
  const todo = await Todo.find().sort({ createdAt: -1 });

  ///////////////// chcke todo  data found or Not//////////////////////////////
  if (todo.length == 0) {
    res.status(404).json({
      success: false,
      message: `Not Found any Todo Data`,
      todo,
    });
  }

  let key = "";
  for (let k in req.query) {
    key = k;
  }

  if (req.query[key]) {
    req.query[key] == "true" ? (req.query[key] = true) : "";
    req.query[key] == "false" ? (req.query[key] = false) : "";

    ///////////////// if it has query then fillter by given key//////////////////////////////
    ///////////////// // route ex http://localhost:3000/todo/?status=true   ////////////////////

    const response = await todo.filter((ele) => {
      return ele[key] == req.query[key];
    });
    ///////////////// chcke filterd data found or Not//////////////////////////////
    if (response.length <= 0) {
      res.status(404).json({
        success: false,
        message: `Not Found ${key} of Todo`,
        todo: response,
      });
    }
    ///////////////// Filterd data resposed//////////////////////////////
    res
      .status(200)
      .json({ success: true, message: `All ${key} of Todo`, todo: response });
  } else {
    ///////////////// respose all todo whithout filtering route (/)//////////////////////////////

    res.status(200).json({ success: true, message: "All Todo", todo });
  }
};

/////////////// Get by Todo Id //////////////

// exports.gettodoById = catchAsyncErrors(async (req, res, next) => {
//   const todo = await Todo.findById(req.params.id);

//   if (!todo) {
//     // return next(new ErrorHandler("Todo not found with this id", 404));
//     res
//       .status(404)
//       .json({
//         success: true,
//         message: `Todo Not found this id:${req.params.id}`,
//       });
//   }

//   res.status(200).json({
//     success: true,
//     todo,
//   });
// });

exports.gettodoById = async (req, res) => {
  let id = req.params.id;

  try {
    const todo = await Todo.findById({ _id: id });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: `Todo Not found this id:${id}`,
      });
    }

    res.status(200).json({ success: true, todo });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ success: false, message: "data not found", err });
  }
};
/////////////// Get by Todo Id //////////////

exports.updatetodo = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    const todo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, message: todo });
  } catch (err) {
    console.log(err);
  }
};

exports.deletetodo = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  const todo = await Todo.findOneAndDelete({ _id: id });

  if (todo) {
    res.status(201).json({ success: true, message: "Todo removed" });
  } else {
    res.status(404).json({ success: false, message: "page not found" });
  }
};
