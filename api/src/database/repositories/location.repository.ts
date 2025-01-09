import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Location } from "../entity/location.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const LocationRepository = databaseManager
  .getRepository<Location>(Location)
  .extend({
    findByLocationName(locationName: string) {
      return this.createQueryBuilder("location")
        .where("location.location_name = :location_name", { locationName })
        .getOne();
    },

    // Need to look into update commands a bit more on extended repositories

    // Need to create an actual Type for coordinates
    // updateGeoLocation(id: number, coordinates: { lat: number; lng: number }) {
    //   return this.createQueryBuilder("location")
    //     .update(coordinates)
    //     .where("location.id = :id", { id })
    //     .execute();
    // },

    // setPrimaryLocation(id: number) {
    //   return this.createQueryBuilder("location")
    //     .update(true)
    //     .where("location.id = :id", { id })
    //     .execute();
    // },

    // unsetPrimaryLocation(id: number) {
    //   return this.createQueryBuilder("location")
    //     .update(false)
    //     .where("location.id = :id", { id })
    //     .execute();
    // },
  });
