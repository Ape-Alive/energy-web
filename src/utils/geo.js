import * as turf from "@turf/turf";
import { Feature } from "ol";
import { getWidth } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import WKT from "ol/format/WKT";
import MultiPolygon from "ol/geom/MultiPolygon";
import { get as getProjection } from "ol/proj";

const geoHelp = {
  // 将非规范结果的multipolygon转化为规范结构，即其中每个polygon只有一个外环
  boundary2turfPolygonList: function (WKTBoundary) {
    let polygonList;
    let geometry = this.readGeometry(WKTBoundary);
    if (geometry.getType() === "Polygon") {
      polygonList = [geometry];
    } else {
      polygonList = geometry.getPolygons();
    }
    // 重组环的层级
    const processedPolygonList = [];
    // 获取所有linearRing
    polygonList.forEach((polygon) => {
      // const rings = polygon.getLinearRings();
      const ringsList = this.formatTurfPolygon(polygon);
      const length = ringsList.length;
      const exteriorRingList = []; //外环
      const interiorRingList = []; // 内环
      for (let i = 0; i < length; i += 1) {
        let index = 0;
        for (let j = 0; j < length; j += 1) {
          if (i !== j) {
            if (
              turf.booleanContains(
                turf.polygon([ringsList[j]]),
                turf.polygon([ringsList[i]])
              )
            ) {
              index += 1;
            }
          }
        }
        if (index % 2 !== 0) {
          //为内环
          interiorRingList.push({
            coordinates: ringsList[i],
            level: index,
          });
        } else {
          //为外环
          exteriorRingList.push({
            coordinates: ringsList[i],
            level: index,
          });
        }
      }
      exteriorRingList.forEach((exteriorRing) => {
        // 同层级正反ring合并为单一polygon
        const polygonString = [exteriorRing.coordinates];
        if (interiorRingList.length > 0) {
          interiorRingList.forEach((interiorRing) => {
            if (
              turf.booleanContains(
                turf.polygon([exteriorRing.coordinates]),
                turf.polygon([interiorRing.coordinates])
              ) &&
              exteriorRing.level === interiorRing.level - 1
            ) {
              polygonString.push(interiorRing.coordinates);
            }
          });
        }
        const formatPolygon = turf.rewind(turf.polygon(polygonString), {
          reversed: true,
        });
        processedPolygonList.push(formatPolygon);
      });
    });
    return processedPolygonList;
  },

  // turf结构的polygon列表转换为 ol 构的multiPolygon
  turfPolygonList2olMultiPolygon: function (polygonList) {
    const geometryList = [];
    polygonList.forEach((polygon) => {
      let feature = new GeoJSON().readFeature(polygon);
      let geometry = feature.getGeometry();
      geometryList.push(geometry);
    });
    return new Feature({
      geometry: new MultiPolygon(geometryList),
    });
  },

  // 获取所有polygon交集区域并转换为WKT格式的multiPolygon输出
  getAvailablePolygon: function (
    polygonList1,
    polygonList2,
    polygonDrawn = null,
    analysisType = "3"
  ) {
    const format = new WKT();
    let resultPolygonList = [];
    // 当为手动绘制分析区域,且不与区域进行对比时
    if (analysisType === "2") {
      try {
        resultPolygonList = this.getIntersectionList(polygonList2, [
          polygonDrawn,
        ]);
      } catch (err) {
        console.log("获取交集区域失败");
        return false;
      }
    } else {
      if (analysisType === "3" && polygonDrawn !== null) {
        // 需要处理和手绘区域交集时候再处理一次
        const tempPolygonList = this.getIntersectionList(
          polygonList2,
          polygonList1
        );
        resultPolygonList = this.getIntersectionList(tempPolygonList, [
          polygonDrawn,
        ]);
      } else {
        // 无需和手绘区域交集情况
        resultPolygonList = this.getIntersectionList(
          polygonList2,
          polygonList1
        );
      }
    }
    // 将geometryList转为Feature
    let distinguishMultipolygonFeature =
      this.turfPolygonList2olMultiPolygon(resultPolygonList);

    return format.writeFeatureText(distinguishMultipolygonFeature, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  },

  getIntersectionList: function (polygonList1, polygonList2) {
    const resultList = [];
    polygonList1.forEach((polygon1) => {
      polygonList2.forEach((polygon2) => {
        try {
          // 找到所交集的范围和所选区域的范围之间的交集
          const intersection = turf.intersect(polygon2, polygon1);
          // 合并的多边形有可能是polygon也有可能是MultiPolygon
          if (intersection !== null) {
            if (intersection.geometry.type !== "MultiPolygon") {
              // 将它转换为turf的 polygon结构
              resultList.push(turf.polygon(intersection.geometry.coordinates));
            } else {
              const coordinatesList = intersection.geometry.coordinates;
              if (coordinatesList.length > 0) {
                coordinatesList.forEach((one) => {
                  resultList.push(turf.polygon(one));
                });
              }
            }
          }
        } catch (err) {
          console.log("获取交集区域出错");
        }
      });
    });
    return resultList;
  },

  // 读取WKT的polygon转换成geometry
  readGeometry: function (polygon) {
    const format = new WKT();
    return format.readGeometry(polygon, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  },

  writeGeometry: function (polygon) {
    const format = new WKT();
    const feature = new Feature({
      geometry: polygon,
    });
    return format.writeFeatureText(feature, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  },

  WKT2Turf: function (region) {
    return turf.polygon(this.formatTurfPolygon(this.readGeometry(region)));
  },

  formatTurfPolygon: function (polygon) {
    const size = 2;
    // 将绘制的geometry的flatCoordinates取出来
    const endsList = polygon.ends_;
    const pointArray = polygon.getFlatCoordinates();
    const multiArray = [];
    let currentArray = [];
    for (let i = 0; i < pointArray.length; i = i + size) {
      currentArray.push(pointArray.slice(i, i + size));
      if (endsList.indexOf(i + size) !== -1) {
        multiArray.push(currentArray);
        currentArray = [];
      }
    }
    return multiArray;
  },

  recombineRegion: function (regionWKT) {
    const format = new WKT();
    const polygonList = this.boundary2turfPolygonList(regionWKT);
    const feature = this.turfPolygonList2olMultiPolygon(polygonList);

    return format.writeFeatureText(feature, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  },

  getMapMatrix: function (zoom = 17) {
    const _zoom = zoom ? zoom + 1 : 18;
    const projection = getProjection("EPSG:4326");
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(_zoom);
    const matrixIds = new Array(_zoom);
    for (let z = 0; z <= _zoom; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = "" + (z - 1);
    }
    return { resolutions, matrixIds };
  },
};

export default geoHelp;
