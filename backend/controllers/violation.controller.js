import Violation from "../model/violation.model.js";
import Notification from "../model/notification.model.js";
import { errorHandler } from "../utils/error.js";
import FuzzySearch from "fuzzy-search";

export const ruleCreate = async (req, res, next) => {
  const { type, description, price } = req.body;

  if (
    !type ||
    !description ||
    !price ||
    type == "" ||
    description == "" ||
    price == ""
  ) {
    return next(errorHandler(400, "All fiels are required "));
  }

  try {
    const addRule = Violation({
      type,
      description,
      price,
    });
    await addRule.save();
    res.json("Violation rules and informations are added. ");
  } catch (error) {
    next(error);
  }
};

export const getAllRule = async (req, res, next) => {
  try {
    const rules = await Violation.find();
    if (rules) {
      res.status(200).json(rules);
    } else {
      return next(400, "Rules not found.");
    }
  } catch (error) {
    next(error);
  }
};

export const getRule = async (req, res, next) => {
  try {
    const ruleId = req.params._id;
    const rule = await Violation.findOne({ _id: ruleId });

    if (rule) {
      res.status(200).json(rule);
    } else {
      return next(404, "Rule not found");
    }
  } catch (error) {
    next(error);
  }
};

export const violaionUpdate = async (req, res, next) => {
  try {
    console.log(req.body);
    
    const violation = await Violation.findOne({ _id: req.params._id });

    if (req.body.type) {
      if (violation.type !== req.body.type) {
        const existType = await Violation.findOne({ type: req.body.type });
        if (existType) {
          return next(errorHandler(409, "Violation Type is already exist"));
        }
      }
    }else{
      req.body.type = violation.type;
    }
    if(!req.body.description){
      req.body.description=violation.description
    }

    const updateViolation = await Violation.findByIdAndUpdate(
      violation._id,
      {
        $set: {
          type: req.body.type,
          description: req.body.description,
          price: req.body.price,
        },
      },
      { new: true }
    );
    const newNotification = Notification({
      fineId:violation._id,
      type:req.body.type,
      price:req.body.price,
    });
    await newNotification.save();

    res.status(200).json(updateViolation);
  } catch (error) {
    next(error);
  }
};

export const deleteViolation = async (req, res, next) => {
  try {
    const violation = await Violation.findById(req.params._id);
    if (!violation) {
      return next(errorHandler(404, "Violation not found"));
    }
    await Violation.findByIdAndDelete(req.params._id);
    res.status(200).json("Violation delete is completed");
  } catch (error) {
    next(error);
  }
};

export const getRuleBySearch = async (req, res, next) => {
  try {
    const { searchText } = req.query;
    if (!searchText || searchText.trim() === "") {
      return next(errorHandler(400, "Search text is required"));
    }
    const rules = await Violation.find();
    if (!rules) {
      return next(400, "Rules not found.");
    }
    const searcher = new FuzzySearch(rules, ["type"], {
      caseSensitive: false,
    });
    const result = searcher.search(searchText);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
