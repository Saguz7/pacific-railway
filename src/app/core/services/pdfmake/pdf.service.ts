import { Injectable } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
type AOA = any[][];
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor() { }

  getTitle(chasis: any) {
    let content_array = [];

    content_array.push(
      { columns: [
          { width: 40, text: '', margin: [0, 0, 0, 3]},
         ]
      },
      { columns: [
          { width: '100%', text: chasis,alignment: 'center', fontSize: 14,bold: true, margin: [0, 0, 0, 0]}
        ]
      },
      {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},

    );



    return content_array;
  }

    getPPSDetails(lon: any,lat: any) {
      let content_array = [];

      content_array.push(
        { columns: [
            { width: 40, text: '', margin: [0, 0, 0, 3]},
           ]
        },
        { columns: [
            { width: 40, text: '', margin: [0, 0, 0, 3]},
           ]
        },
        { columns: [
             { width: 300, text: '    Last Reported Location ', fontSize: 12,bold: true, margin: [0, 0, 0, 0]}
          ]
        },
        {canvas: [ { type: 'line', x1: 10, y1: 0, x2: 505, y2: 0, lineWidth: 1 } ]},

        { columns: [
            { width: 40, text: '', margin: [0, 0, 0, 3]},
           ]
        },
        { columns: [
            { width: '25%', text: 'Lat:',alignment: 'right', fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
            { width: '25%', text: lat, fontSize: 11,margin: [0, 0, 0, 0]},
            { width: '25%', text: 'Lon:',alignment: 'right', fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
            { width: '25%', text: lon, fontSize: 11,margin: [0, 0, 0, 0]},

           ]
        },
          { columns: [
              { width: 40, text: '', margin: [0, 20, 0, 2]},
             ]
          }
      );



      return content_array;
    }


    getPPSDetailsAtributtes(date: any,event: any,properties: any,geofences: any) {
      let content_array = [];
      let content_sensors = [];
      let content_array_left = [];
      let content_array_right = [];

      content_array.push(
        { columns: [
            { width: 40, text: '', margin: [0, 20, 0, 3]},
           ]
        },
        { columns: [
            { width: 300, text: '   Details ', fontSize: 12,bold: true, margin: [0, -17, 0, 0]}
          ]
        },
        {canvas: [ { type: 'line', x1: 10, y1: 0, x2: 505, y2: 0, lineWidth: 2 } ]},
      );



          if(properties!=undefined){
            content_array_left.push(

              { columns: [
                  { width: 40, text: '', margin: [0, 0, 0, 3]},
                 ]
              },

              { columns: [
                   {  width: '25%',  text: 'Asset Class:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                   {  width: '75%',  text: this.formatstring(properties.asset_class), fontSize: 9 , margin: [0, 0, 0, 0]}

                ]
              },

              { columns: [
                  { width: 40, text: '', margin: [0, 0, 0, 3]},
                 ]
              },
            );

            if(properties.chassis_type!=undefined){
              content_array_left.push(

                { columns: [
                     {  width: '25%',  text: 'Chassis Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                     {  width: '75%',  text: properties.chassis_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                  ]
                },
                { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3]},
                   ]
                },
              );
            }
            content_array_left.push(



                { columns: [
                     {  width: '25%',  text: 'Door Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                     {  width: '75%',  text: properties.door_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                  ]
                },

                    { columns: [
                        { width: 40, text: '', margin: [0, 0, 0, 3]},
                       ]
                    },

                    { columns: [
                         {  width: '25%',  text: 'Height:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                         {  width: '75%',  text: properties.height, fontSize: 9 , margin: [0, 0, 0, 0]}

                      ]
                    },


                      { columns: [
                          { width: 40, text: '', margin: [0, 0, 0, 3]},
                         ]
                      },


                      { columns: [
                           {  width: '25%',  text: 'Width:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                           {  width: '75%',  text: properties.width, fontSize: 9 , margin: [0, 0, 0, 0]}

                        ]
                      },

                        { columns: [
                            { width: 40, text: '', margin: [0, 0, 0, 3]},
                           ]
                        },

                        { columns: [
                             {  width: '25%',  text: 'Initial Distance:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                             {  width: '75%',  text: properties.initial_distance, fontSize: 9 , margin: [0, 0, 0, 0]}

                          ]
                        },


                          { columns: [
                              { width: 40, text: '', margin: [0, 0, 0, 3]},
                             ]
                          },

                          { columns: [
                               {  width: '25%',  text: 'Mounting Location:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                               {  width: '75%',  text: this.formatstring(properties.mounting_location), fontSize: 9 , margin: [0, 0, 0, 0]}

                            ]
                          },


                            { columns: [
                                { width: 40, text: '', margin: [0, 0, 0, 3]},
                               ]
                            },
                            { columns: [

                              {  width: '25%',  text: 'Sensors:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]}
                              ]
                            },
            );
            for(var i = 0; i < properties.sensors.length;i++){
              content_array_left.push(
                { columns: [

                  {  width: '100%',  text: ' - ' + this.formatstring(properties.sensors[i]) , fontSize: 9 , margin: [0, 0, 0, 0]}
                  ]
                }
              );


            }
          }

          content_array_right.push(
            { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3]},
               ]
            },
            { columns: [

              {  width: '25%',  text: 'Geofences:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]}
              ]
            }
          )

          for(var i = 0; i < geofences.length;i++){
            content_array_right.push(
              { columns: [

                {  width: '100%',  text: ' ' + geofences[i].name , fontSize: 9 , margin: [0, 0, 0, 0]}
                ]
              }
            );


          }

          let arrayParaTabla = [
            [
              content_array_left ,
              content_array_right ,

            ]
          ];


          let dateTableDay =
            {
                  style: 'tableExample',
                   table: {
                    headerRows: 1,
                    widths: [ '50%','50%'],
                    body:  arrayParaTabla,
                  },layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return (rowIndex === 0) ? '#FFFFFF' : null;
                    },
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 'white' : 'white';
                    },
                    vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
                    },
                    paddingLeft: function(i, node) { return 10; },
                  }
           };

         content_array.push(dateTableDay);

          /*

          if(properties!=undefined){
            content_array.push(

              { columns: [
                  { width: 40, text: '', margin: [0, 0, 0, 3]},
                 ]
              },

              { columns: [
                   {  width: '25%',  text: 'Asset Class:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                   {  width: '75%',  text: this.formatstring(properties.asset_class), fontSize: 9 , margin: [0, 0, 0, 0]}

                ]
              },

              { columns: [
                  { width: 40, text: '', margin: [0, 0, 0, 3]},
                 ]
              },
            );

            if(properties.chassis_type!=undefined){
              content_array.push(

                { columns: [
                     {  width: '25%',  text: 'Chassis Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                     {  width: '75%',  text: properties.chassis_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                  ]
                },
                { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3]},
                   ]
                },
              );
            }
            content_array.push(



                { columns: [
                     {  width: '25%',  text: 'Door Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                     {  width: '75%',  text: properties.door_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                  ]
                },

                    { columns: [
                        { width: 40, text: '', margin: [0, 0, 0, 3]},
                       ]
                    },

                    { columns: [
                         {  width: '25%',  text: 'Height:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                         {  width: '75%',  text: properties.height, fontSize: 9 , margin: [0, 0, 0, 0]}

                      ]
                    },


                      { columns: [
                          { width: 40, text: '', margin: [0, 0, 0, 3]},
                         ]
                      },


                      { columns: [
                           {  width: '25%',  text: 'Width:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                           {  width: '75%',  text: properties.width, fontSize: 9 , margin: [0, 0, 0, 0]}

                        ]
                      },

                        { columns: [
                            { width: 40, text: '', margin: [0, 0, 0, 3]},
                           ]
                        },

                        { columns: [
                             {  width: '25%',  text: 'Initial Distance:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                             {  width: '75%',  text: properties.initial_distance, fontSize: 9 , margin: [0, 0, 0, 0]}

                          ]
                        },


                          { columns: [
                              { width: 40, text: '', margin: [0, 0, 0, 3]},
                             ]
                          },

                          { columns: [
                               {  width: '25%',  text: 'Mounting Location:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                               {  width: '75%',  text: this.formatstring(properties.mounting_location), fontSize: 9 , margin: [0, 0, 0, 0]}

                            ]
                          },


                            { columns: [
                                { width: 40, text: '', margin: [0, 0, 0, 3]},
                               ]
                            },
                            { columns: [

                              {  width: '25%',  text: 'Sensors:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]}
                              ]
                            },
            );
            for(var i = 0; i < properties.sensors.length;i++){
              content_array.push(
                { columns: [

                  {  width: '100%',  text: ' - ' + this.formatstring(properties.sensors[i]) , fontSize: 9 , margin: [0, 0, 0, 0]}
                  ]
                }
              );


            }
          }

          */






      return content_array;
    }

    formatstring(content){
      return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }


}
