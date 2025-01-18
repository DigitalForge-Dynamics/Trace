export default abstract class BaseMapper<TSource, TDestination> {
  abstract map(source: TSource): TDestination;

  mapMany(source: TSource[]): TDestination[] {
    return source.map((source) => this.map(source));
  }
}
