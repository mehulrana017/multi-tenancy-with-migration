import { Request, Response, NextFunction } from "express";
import Master from "../models/masterModel";
import { getTenantDBConnection } from "../config/dbConfig";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tenantName, email } = req.body;

  try {
    const tenantDBName = `tenant_${tenantName.toLowerCase()}`;

    // Store tenant metadata in Master DB
    const masterRecord = new Master({
      tenantName,
      email,
      tenantDBName,
    });
    await masterRecord.save();

    // Ensure tenant DB is created and cached
    await getTenantDBConnection(tenantDBName);

    res
      .status(201)
      .json({ message: `Tenant ${tenantDBName} created successfully!` });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    const tenant = await Master.findOne({ email });

    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    const tenantConnection = await getTenantDBConnection(tenant.tenantDBName);
    const TenantModel = tenantConnection.model("TenantData");

    const tenantData = await TenantModel.find();
    res.status(200).json({ tenantData });
  } catch (error) {
    next(error);
  }
};
