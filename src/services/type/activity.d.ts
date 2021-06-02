export type CreateType = {
  begintime: string; //	否	TIMESTAMP	开始时间
  endtime: string; //	否	TIMESTAMP	结束时间
  type: 1 | 2; //	否	INT	类型 1公告 2普通活动
  conference: string; //	是	integer	可见范围(渠道id)
  title: string; //	否	String	标题（名称）
  iconfile: file; // 否	file	图标文件
  content?: string; //	否	String	内容文字
  imgfile: file; //	否	file	内容图片文件
  others?: string; //	否	String	其他配置
};

export type UpdateType = {
  id: number;
  begintime: string; //	否	TIMESTAMP	开始时间
  endtime: string; //	否	TIMESTAMP	结束时间
  type: 1 | 2; //	否	INT	类型 1公告 2普通活动
  conference: string; //	是	integer	可见范围(渠道id)
  title: string; //	否	String	标题（名称）
  iconfile: file; // 否	file	图标文件
  content?: string; //	否	String	内容文字
  imgfile: file; //	否	file	内容图片文件
  others?: string; //	否	String	其他配置
};
