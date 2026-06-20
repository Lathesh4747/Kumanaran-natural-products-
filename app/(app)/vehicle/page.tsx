import { db } from "@/db";
import { vehicles, vehicleLoadings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { VehicleClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vehicle" };

export default async function VehiclePage() {
  const [allVehicles, allLoadings] = await Promise.all([
    db.select().from(vehicles).orderBy(vehicles.name),
    db
      .select({
        id: vehicleLoadings.id,
        vehicleId: vehicleLoadings.vehicleId,
        loadingDate: vehicleLoadings.loadingDate,
        totalPackets: vehicleLoadings.totalPackets,
        status: vehicleLoadings.status,
        remarks: vehicleLoadings.remarks,
        vehicleName: vehicles.name,
      })
      .from(vehicleLoadings)
      .leftJoin(vehicles, eq(vehicleLoadings.vehicleId, vehicles.id))
      .orderBy(vehicleLoadings.loadingDate),
  ]).catch(() => [[], []]);

  return <VehicleClient vehicles={allVehicles} loadings={allLoadings} />;
}
