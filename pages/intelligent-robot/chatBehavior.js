/*
 * @Author: liweibiao
 * @Date: 2021-07-09 15:06:12
 * @LastEditTime: 2021-07-09 15:33:00
 * @Description: 
 */



// 文件系统管理器
let fsm;

export const imagesFilesBehavior = Behavior({
    data: {
        // 下载到本地处理过的文件列表
        _fileList: [],
	},

    methods: {

        // 初始化
        async _initFsm(data) {
			fsm = wx.getFileSystemManager();
            let _fileList = await this._getFileUrlForId(data);

            this.setData({
                _fileList
            })

        },
        
        // 根据id下载文件并返回url
        async _getFileUrlForId(fls) {
            // 文件路径
			let filePath = wx.env.USER_DATA_PATH + "/hsz_robot_ans_files";
			// 创建目录
			try {
				fsm.accessSync(filePath);
			} catch (e) {
				fsm.mkdirSync(filePath);
			}

            let _fileArr = [];

            for (let fl of fls) {
				// 使用id作为图片名，保证唯一以及名称混乱问题
				let name = fl.ans_file_name;
                let fileType = 'pdf';

				try {
					// 图片本地已存在，直接获取图片本地路径
					fsm.accessSync(`${filePath}/${name}`);
				} catch (e) {
					// 图片本地不存在，则下载保存再获取本地路径
					let res = await API.download({
						id: fl.ans_file_id,
						isSlt: 0,
					},true);
					console.log(res);
					fsm.writeFileSync(`${filePath}/${name}.${fileType}`, res.data, 'utf8');
				} finally {
					_fileArr.push({ 
						url:`${filePath}/${name}.${fileType}`,
						fileId: fl.ans_file_id
					});
				}
			}
            return Promise.resolve(_fileArr);
        },
    }
})