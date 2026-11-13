import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSeries, alignSeries} from '../src/lib/chart-data.mjs';

test('CSV reads named columns, BOM, CRLF, and quoted fields instead of fixed offsets', () => {
  const data=parseSeries('\uFEFFDate,Note,Close\r\n"2023-01-02","a,b",12.5\r\n2023-01-01,"a ""quote""",10\r\n','Close');
  assert.deepEqual(data, {points:[{date:'2023-01-01',value:10},{date:'2023-01-02',value:12.5}],invalidRows:0});
});
test('missing, nonnumeric, negative and invalid calendar values are excluded, not zero-filled', () => {
  const data=parseSeries('Date,Close\n2023-01-01,\n2023-01-02,NaN\n2023-02-30,4\n2023-01-04,-5\n2023-01-05,0\n2023-01-06,Infinity\n','Close');
  assert.deepEqual(data,{points:[{date:'2023-01-05',value:0}],invalidRows:5});
});
test('duplicate dates keep the last value and sort oldest first', () => {
  assert.deepEqual(parseSeries('Date,Dividends\n2023-02-01,2\n2023-01-01,1\n2023-01-01,3','Dividends').points,[{date:'2023-01-01',value:3},{date:'2023-02-01',value:2}]);
});
test('bad headers and malformed quotes fail; header-only data stays empty', () => {
  assert.throws(()=>parseSeries('<html>404</html>','Close'));
  assert.throws(()=>parseSeries('Date,Open\n2023-01-01,1','Close'));
  assert.throws(()=>parseSeries('Date,Close\n"2023-01-01,1','Close'));
  assert.deepEqual(parseSeries('Date,Dividends\n','Dividends'),{points:[],invalidRows:0});
});
test('dividend-only dates and zero values survive alignment', () => {
  const aligned=alignSeries([{date:'2023-01-02',value:10}],[{date:'2023-01-01',value:0},{date:'2023-01-02',value:1}]);
  assert.deepEqual(aligned,{dates:['2023-01-01','2023-01-02'],prices:[null,10],dividends:[0,1]});
});
