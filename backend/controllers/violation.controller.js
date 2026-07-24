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
    return next(errorHandler(400, "All fields are required "));
  }

  try {
    const addRule = Violation({
      type,
      description,
      price,
    });
    await addRule.save();
    return res.status(201).json({message: "Violation rule and information added successfully"});
  } catch (error) {
    next(error);
  }
};

export const getAllRule = async (req, res, next) => {
  try {
    const rules = await Violation.find();
    return res.status(200).json(rules);
  } catch (error) {
    next(error);
  }
};

export const getRule = async (req, res, next) => {
  try {
    const ruleId = req.params._id;
    const rule = await Violation.findById(ruleId);

    if (!rule) {
      return next(errorHandler(404, "Rule not found"));
    }

    return res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
};

export const violationUpdate = async (req, res, next) => {
  try {
    const violation = await Violation.findById(req.params._id);
    if (!violation) {
      return next(errorHandler(404, "Violation not found"));
    }

    let type = req.body.type || violation.type;
    let description = req.body.description || violation.description;
    let price = req.body.price ?? violation.price;

    if (type !== violation.type) {

      const existType = await Violation.findOne({
        type
      });

      if (existType) {
        return next(
            errorHandler(409, "Violation Type already exists")
        );
      }
    }

    const updateViolation = await Violation.findByIdAndUpdate(
        violation._id,
        {
          $set:{
            type,
            description,
            price
          }
        },
        {
          new:true
        }
    );

    const newNotification = new Notification({
      fineId: violation._id,
      type,
      price
    });
    await newNotification.save();
    return res.status(200).json(updateViolation);
  } catch(error){
    next(error);
  }
};

export const deleteViolation = async (req,res,next)=>{
  try {
    const violation = await Violation.findByIdAndDelete(req.params._id);
    if(!violation){
      return next(
          errorHandler(404,"Violation not found")
      );
    }
    return res.status(200).json("Violation delete is completed");
  }catch(error){
    next(error);
  }
};

export const getRuleBySearch = async (req, res, next) => {
  try {
    const {searchText} = req.query;
    if(!searchText || searchText.trim()===""){
      return next(
          errorHandler(400,"Search text is required")
      );
    }

    const rules = await Violation.find();

    const searcher = new FuzzySearch(
        rules,
        ["type","description"],
        {
          caseSensitive:false
        }
    );

    const result = searcher.search(searchText);
    return res.status(200).json(result);
  }catch(error){
    next(error);
  }
};
