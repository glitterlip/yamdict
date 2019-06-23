const fs = require('fs');
const pako = require('pako');
const path = require('path');
const stream = require('stream');

import { ripemd128 } from './ripemd128';

export default class MdictParser {

  headLength;
  headerStr;
  encoding;
  keyWordSummary;
  KeyindexInfo;
  offset;
  keywordIndex = [];

  tail = 1;//null tail utf8 1
  bpu;//bytes_per_unit
  keyBlocks = [];
  indexMap;

  constructor(parth) {

    this.offset = 0;
    this.length = 4;
    this.indexMap = new Map();
    this.flipMap = new Map();
    let buffer = fs.readFileSync(path.join(__dirname, '../resources/dicts/柯林斯双解.mdx'));


// 创建一个bufferstream
    this.stream = new stream.PassThrough();
//将Buffer写入
    this.stream.end(buffer);


    // this.stream = fs.createReadStream('buffer');
    // this.stream.on('readable', () => {

    this.headLength = this.getHeadLength(this.read(this.length));   //+4
    this.headerStr = this.getHeader(this.read(this.headLength)); //+1620=1624
    // this.encoding = this.getEncoding();
    this.checkSum(this.read(4)); //+4=1628
    this.keyWordSummary = this.getKeyWordSummary(this.read(44)); //+44=1672
    this.keyWordSummaryBuffer = this.getKeyindexInfoBuffer();

    this.getKeyindexInfo(this.keyWordSummaryBuffer);

    this.getKeyBlocks(this.read(this.keyWordSummary.key_blocks_len));

    this.getRecordBlocks();

    this.findWord('24-7');
    this.findWord('911');
    this.findWord('999');


    // });


  }


  read = (size) => {
    console.log('当前位置', this.offset);
    this.offset += size;
    console.log('操作完成位置', this.offset);
    return this.stream.read(size);
  };

  /**
   * 头部长度
   * @param buffer
   * @returns {*|number}
   */
  getHeadLength = (buffer) => {

    let length = buffer.readInt32BE();
    console.log('getHeadLength', length);
    return length;


  };

  /**
   * 头部信息
   * @param buffer
   * @returns {string}
   */
  getHeader = (buffer) => {
    let header = buffer.toString('utf16le');
    console.log('头:' + header);
    return header.replace(/\0$/, '');

  };

  getEncoding = () => {
    let xmlDom = (new DOMParser()).parseFromString(this.headerStr, 'text/xml');
    this.encoding = xmlDom.getElementsByTagName('Encoding')[0];
    console.log(this.encoding);
  };

  /**
   * keyword 统计信息
   * @returns {{key_index_comp_len: *, key_blocks_len: *, num_blocks: *, num_entries: *, key_index_decomp_len: *}}
   */
  getKeyWordSummary = (buffer) => {

    let offset = 0;


    let keyWordSummary = {
      num_blocks: this.read8Int(buffer.slice(offset, offset += 9)), //20
      num_entries: this.read8Int(buffer.slice(offset -= 1, offset += 9)), //词典包含词条数
      key_index_decomp_len: this.read8Int(buffer.slice(offset -= 1, offset += 9)),  //keyword_index 解压后的字节数 // Ver >= 2.0 only
      key_index_comp_len: this.read8Int(buffer.slice(offset -= 1, offset += 9)), //keyword_index 压缩大小
      key_blocks_len: this.read8Int(buffer.slice(offset -= 1, offset += 9)) //keyword_block 长度
    };

    this.checkSum(buffer.slice(offset -= 1, offset += 5));

    console.log('词典相关信息', keyWordSummary);

    return keyWordSummary;
  };


  /**
   * 读取 8字节数字
   * @returns {*|number}
   */
  read8Int = (buffer) => {
    return buffer.readInt32BE(4);
  };

  /**
   * 校验和
   * @returns {any}
   */
  checkSum = (buffer) => {
    return;

  };

  /**
   * ripemd128 解密
   * @param buf
   * @param key
   * @returns {*}
   */
  decrypt = (buf, key) => {
    key = ripemd128(key);
    let byte, keylen = key.length, prev = 0x36, i = 0, len = buf.length;
    for (; i < len; i++) {
      byte = buf[i];
      byte = ((byte >> 4) | (byte << 4));                  // & 0xFF;  <-- it's already a byte
      byte = byte ^ prev ^ (i & 0xFF) ^ key[i % keylen];
      prev = buf[i];
      buf[i] = byte;
    }
    return buf;
  };


  /**
   * 获取包含 keyword_index 的 buffer
   * @returns {*}
   */
  getKeyindexInfoBuffer = () => {
    let start = this.offset;

    let buffer = this.read(this.keyWordSummary.key_index_comp_len);


    let compressKeyindex = buffer;

    let compressType = buffer.slice(0, 5).readUInt8();

    console.log(compressType, this.offset, buffer.buffer, buffer.byteLength);

    // skip comp_type (4 bytes with tailing \x00) and checksum (4 bytes)
    let offset = 8;

    let tmp = new Uint8Array(compressKeyindex.slice(8));
    let checksum = new Uint8Array(compressKeyindex, 4, 4);
    // console.log(checksum);
    let passkey = new Uint8Array(8);
    passkey.set(checksum.slice(4, 9), 0);  // key part 1: checksum
    passkey.set([0x95, 0x36, 0x00, 0x00], 4);         // key part 2: fixed data
    // console.log(tmp);
    tmp = this.decrypt(tmp, passkey);

    this.depressedKeyindex = pako.inflate(tmp);
    // console.log(this.depressedKeyindex);

    return this.depressedKeyindex;

  };


  getKeyindexInfo = (buffer) => {

    // console.log(buffer);
    buffer = Buffer.from(buffer);
    console.log(buffer);
    let offset = 0;

    for (let i = 0, size; i < this.keyWordSummary.num_blocks; i++) {

      let num_entries = buffer.readUInt32BE(offset += 4); //每个 keyindex 区块包含的 keyindex 数量 8bytes

      let first_word_size = size = buffer.readUInt16BE(offset += 4); //每个区块第一个单词的长度 2bytes

      let first_word = buffer.toString('utf8', offset += 2, offset += first_word_size);


      let last_word_size = size = buffer.readUInt16BE(offset += this.tail);

      let last_word = buffer.toString('utf8', offset += 2, offset += last_word_size);


      let comp_size = buffer.readUInt32BE(offset += (this.tail + 4));


      let decomp_size = buffer.readUInt32BE(offset += 8);


      this.keywordIndex[i] = {
        num_entries,
        first_word, first_word_size,
        last_word, last_word_size,
        comp_size,
        decomp_size,
        // offset,    // offset of the first byte for the target key block in mdx/mdd file
        index: i            // index of this key index, used to search previous/next block
      };
      offset += 4;
      console.log('for offset end', this.keywordIndex[i]);


    }

    return this.keywordIndex;


  };

  getKeyBlocks = (buffer) => {

    let blocks = buffer;

    //每个 block 起始位置
    let blockOffset = 0;
    let count = 0;


    for (let i = 0, size; i < this.keyWordSummary.num_blocks; i++) {


      //压缩的block
      let block = blocks.slice(blockOffset, blockOffset + this.keywordIndex[i].comp_size);

      //更新block起始位置
      blockOffset += this.keywordIndex[i].comp_size;
      //skip compress_type and check_sum
      block = block.slice(8, this.keywordIndex[i].comp_size);

      //解压后的block
      block = pako.inflate(block);
      console.log(block);
      //arraybuffer to buffer
      let blockBuffer = Buffer.from(block);

      console.log(blockBuffer.byteLength);


      for (let offset = 0; offset < blockBuffer.byteLength;) {

        let wordOffset = blockBuffer.readUInt32BE(offset += 4);

        let [word, end] = this.searchEnd(blockBuffer, offset += 4);

        this.indexMap.set(word, { wordOffset, count, block: i });
        this.flipMap.set(count, { wordOffset });

        offset = end;
        // i++;
        count++;


        //word ,word_definition 在解压后的起始位置
        // console.log(word, wordOffset);
        // console.log(this.flipMap);

      }


    }


  };


  searchEnd = (buffer, offset = 0) => {

    let start = offset;
    while (buffer.readInt8(start += 1)) {

    }
    let word = buffer.toString('utf8', offset, start);
    return [word, start + 1];

  };

  getRecordBlocks = () => {

    let offsetInfo = new Map();
    let numBlocks = this.read8Int(this.read(8));
    let numEntries = this.read8Int(this.read(8));
    let indexLen = this.read8Int(this.read(8));
    let blocksLen = this.read8Int(this.read(8));
    let blockSize = [];
    let offset = 0;
    let globalOffset = this.offset + indexLen;
    let blockOffset = 0;
    let decompressOffset = 0;

    for (let i = 0; i < numBlocks;) {
      let compressSize = this.read8Int(this.read(8));
      let deCompressSize = this.read8Int(this.read(8));
      decompressOffset += deCompressSize;
      blockSize.push({ compressSize, deCompressSize, globalOffset, decompressOffset, blockOffset });
      offsetInfo.set(i, offset += deCompressSize);
      i++;
      globalOffset += compressSize;
      blockOffset += deCompressSize;

    }

    this.recordInfo = {
      numBlocks, numEntries, indexLen, blocksLen, blockSize, offsetInfo
    };
    console.log(this.recordInfo);

    console.log('block started from: ' + this.offset);

    // this.concatFile(path.join(__dirname, '../resources/dicts/柯林斯双解.mdx.txt'));


  };

  concatFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      return true;
    }

    fs.openSync(filePath, 'a');

    for (let i = 0; i < this.recordInfo.blockSize.length; i++) {
      let block = this.read(this.recordInfo.blockSize[i].compressSize);

      let comp = block.slice(8, this.recordInfo.blockSize[i].compressSize);
      console.log(this.recordInfo.blockSize[i].compressSize);
      console.log(i);
      if (i <= 5) {
        console.log(comp);
        console.log('read end cut', this.offset);

      }
      let str = Buffer.from(pako.inflate(comp)).toString('utf8');


      // let fd = fs.openSync(path.join(__dirname, '../resources/dicts/柯林斯双解.mdx.cache'), 'a+');

      // fs.writeFileSync(path.join(__dirname, '../resources/dicts/柯林斯双解.mdx.txt'), str);
      fs.writeFileSync(filePath, str, { flag: 'a+' });
    }
  };

  findWord = (word = 'aback') => {
    let wordSite = this.indexMap.get(word);

    console.log('weizhi', wordSite);
    let start = wordSite.wordOffset;
    let count = wordSite.count;

    let flip = this.flipMap.get(count + 1);

    let end = flip.wordOffset;

    console.log('start', this);
    console.log('start', start);
    console.log('wordOffset', end);

    let wanted;
    let cOffset = 0;
    let dOffset = 0;
    let size = this.recordInfo.blockSize.length;

    for (let i = 0; i < size;) {
      if (dOffset > start) {
        wanted = {
          compressOffset: cOffset - this.recordInfo.blockSize[i - 1].compressSize,
          decompressOffset: dOffset - this.recordInfo.blockSize[i - 1].deCompressSize,
          length: this.recordInfo.blockSize[i - 1].compressSize,
          start: start - (dOffset - this.recordInfo.blockSize[i - 1].deCompressSize),
          end: end - (dOffset - this.recordInfo.blockSize[i - 1].deCompressSize),
          count: i - 1,
          wordLength: end - start

        };

        console.log(wanted);
        console.log(cOffset, dOffset, this.recordInfo.blockSize[i - 1]);
        break;
      }
      dOffset += this.recordInfo.blockSize[i].deCompressSize;
      cOffset += this.recordInfo.blockSize[i].compressSize;
      i++;
    }

    //解压目标 word 所在区块 然后截取 start-end 返回
    let buffer = fs.readFileSync(path.join(__dirname, '../resources/dicts/柯林斯双解.mdx'));

    console.log(buffer);
    let no = this.recordInfo.blockSize[wanted.count];
    console.log(no, no.globalOffset, no.compressSize);
    //303516
    let compressed = buffer.slice(no.globalOffset + 8, no.globalOffset + no.compressSize);

    console.log(compressed);
    let res = Buffer.from(pako.inflate(compressed));
    // let res = Buffer.from(pako.inflate(compressed)).toString('utf8');

    let arr = this.searchEnd(res, wordSite.wordOffset - (this.recordInfo.blockSize[wanted.count]).blockOffset);
    // console.log(arr[0]);


    return arr[0];
  };


}
